<?php

if ( isset($_POST['fname']) && isset($_POST['femail']) && isset($_POST['fphone']) && isset($_POST['fsubject'])  && isset($_POST['fmessage']) ) {

    echo "test passed!";

    $name = $_POST['fname'];
    $mail = $_POST['femail'];
    $phone = $_POST['fphone'];
    $subject = $_POST['fsubject'];
    $message = nl2br($_POST['fmessage']);

    $mailTo = "chris@sftech.ch";
    $mailFrom = "chris@sftech.ch"; //$mail;
    $mailSubject = 'Nouveau message provenant d\'une Offre / Conseil';
    $mailMessage = '<b>Name:</b> '.$name.' <br><b>Email:</b> '.$mail.' <br><b>Phone:</b> '.$phone.' <br><b>Sujet:</b> '.$subject.' <p>'.$message.'</p>';

    $headers = "From: $mailFrom\n";
    $headers .= "MIME-version: 1.0\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\n";
    
    if( mail($mailTo, $mailSubject, $mailMessage, $headers) ) {
        echo "success";
    } else {
        echo "The server failed to send the message. Please try again later.";
    }
}
?>