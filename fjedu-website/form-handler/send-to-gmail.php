<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $to = "your-email@gmail.com";  // <-- 改成你要接收的 Gmail
  $subject = "飛翔少年 報名資料";
  $name = $_POST["name"];
  $phone = $_POST["phone"];
  $email = $_POST["email"];
  $course = $_POST["course"];
  $guardian = $_POST["guardian"];

  $message = "學生姓名：$name\n電話：$phone\nEmail：$email\n報名課程：$course\n監護人：$guardian";

  $headers = "From: webmaster@yourdomain.com";

  if (mail($to, $subject, $message, $headers)) {
    echo "<script>alert('報名成功！');window.location.href='../index.html';</script>";
  } else {
    echo "<script>alert('報名失敗，請稍後再試');history.back();</script>";
  }
}
?>
