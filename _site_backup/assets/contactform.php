<?php

if ( isset($_POST['fname'])
  && isset($_POST['femail'])
  && isset($_POST['fcountry'])
  && isset($_POST['flanguage'])
  && isset($_POST['fsubject'])
  && isset($_POST['fmessage']) ) {

    $name = $_POST['fname'];
    $email = $_POST['femail'];
    $country = $_POST['fcountry'];
    $language = $_POST['flanguage'];
    $phone = $_POST['fphone'];
    $subject = $_POST['fsubject'];
    $message = nl2br($_POST['fmessage']);

    $mailTo = "info@sftech.ch";  // Address to be sent
    $mailFrom = "info@sftech.ch"; // Address to be sent from the server;
    $mailSubject = 'Nouveau message provenant d\'une Offre / Conseil';
    $mailMessage = '<b>Name:</b> '.$name.' <br><b>Email:</b> '.$email.' <br><b>Country:</b> '.$country.' <br><b>Language:</b> '.$language.' <br><b>Phone:</b> '.$phone.' <br><b>Sujet:</b> '.$subject.' <p>'.$message.'</p>';

    $headers = "From: $mailFrom\r\nReply-to: $email\n";
    $headers .= "MIME-version: 1.0\n";
    $headers .= "Content-type: text/html; charset=UTF-8\n";
    
    if( mail($mailTo, $mailSubject, $mailMessage, $headers) ) {
        echo "success";
    } else {
        echo "The server failed to send the message. Please try again later.";
    }
}
?>