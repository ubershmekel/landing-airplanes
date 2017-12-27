:http-server
:reload


: `http-server --ssl`
: CN=[hostname]
: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -subj '/CN=yuv13' -nodes
: https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl

http-server --ssl
