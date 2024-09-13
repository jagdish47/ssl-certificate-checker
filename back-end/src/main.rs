use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_cors::Cors;  
use serde::{Deserialize, Serialize};
use tokio::net::TcpStream;
use rustls::{ClientConfig, RootCertStore, OwnedTrustAnchor};
use tokio_rustls::{TlsConnector, rustls::ServerName};
use x509_parser::prelude::*;
use x509_parser::extensions::GeneralName;
use x509_parser::oid_registry::*;
use std::sync::Arc;

#[derive(Deserialize)]
struct DomainRequest {
    domain: String,
}

#[derive(Serialize)]
struct CertificateResponse {
    validity: bool,
    expiration_date: String,
    issuer: String,
    subject: String,
    is_valid_for_domain: bool,
}

async fn check_ssl(domain_req: web::Json<DomainRequest>) -> impl Responder {
    let domain = &domain_req.domain;

    match fetch_ssl_certificate(domain).await {
        Ok(cert_info) => HttpResponse::Ok().json(cert_info),
        Err(_) => HttpResponse::BadRequest().body("Invalid domain or SSL check failed."),
    }
}

async fn fetch_ssl_certificate(domain: &str) -> Result<CertificateResponse, &'static str> {
    let addr = format!("{}:443", domain);
    let stream = TcpStream::connect(addr).await.map_err(|_| "Failed to connect")?;

    let mut root_store = RootCertStore::empty();
    root_store.add_server_trust_anchors(webpki_roots::TLS_SERVER_ROOTS.0.iter().map(|ta| {
        OwnedTrustAnchor::from_subject_spki_name_constraints(ta.subject, ta.spki, ta.name_constraints)
    }));

    let config = Arc::new(ClientConfig::builder()
        .with_safe_defaults()
        .with_root_certificates(root_store)
        .with_no_client_auth());

    let connector = TlsConnector::from(config);
    let server_name = ServerName::try_from(domain).map_err(|_| "Invalid domain")?;

    let tls_stream = connector.connect(server_name, stream).await.map_err(|_| "TLS error")?;
    let session = tls_stream.get_ref().1;

    if let Some(certificates) = session.peer_certificates() {
        let cert = &certificates[0].0;
        let (_, parsed_cert) = x509_parser::parse_x509_certificate(cert).map_err(|_| "Failed to parse")?;

        let subject = parsed_cert.subject().to_string();
        let issuer = parsed_cert.issuer().to_string();
        let not_after = parsed_cert.validity().not_after.to_rfc2822();

        let mut valid_for_domain = false;
        for (oid, ext) in parsed_cert.extensions() {
            if oid == &OID_X509_EXT_SUBJECT_ALT_NAME {
                if let ParsedExtension::SubjectAlternativeName(san) = ext.parsed_extension() {
                    for name in &san.general_names {
                        if let GeneralName::DNSName(dns_name) = name {
                            if *dns_name == domain {
                                valid_for_domain = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        let response = CertificateResponse {
            validity: true,
            expiration_date: not_after,
            issuer,
            subject,
            is_valid_for_domain: valid_for_domain,
        };

        return Ok(response);
    }
    Err("No certificates found")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
                .supports_credentials())
            .route("/check_ssl", web::post().to(check_ssl))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
