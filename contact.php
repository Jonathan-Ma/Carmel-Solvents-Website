<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /#contact');
    exit;
}

$to      = 'billwu@carmelsolv.com';
$name    = htmlspecialchars(trim($_POST['name'] ?? ''));
$company = htmlspecialchars(trim($_POST['company'] ?? ''));
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(trim($_POST['phone'] ?? ''));
$product = htmlspecialchars(trim($_POST['product'] ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$message) {
    header('Location: /#contact?status=error');
    exit;
}

$subject = "Quote Request from $name" . ($company ? " ($company)" : '');

$body  = "Name:    $name\n";
$body .= $company ? "Company: $company\n" : '';
$body .= "Email:   $email\n";
$body .= $phone   ? "Phone:   $phone\n"   : '';
$body .= $product ? "Product: $product\n" : '';
$body .= "\nMessage:\n$message\n";

$headers  = "From: noreply@carmelsolv.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $body, $headers);

header($sent ? 'Location: /#contact?status=sent' : 'Location: /#contact?status=error');
exit;
