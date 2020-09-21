<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    login();
}
?>

<h1 class="title">LOGIN</h1>
<?php if (!empty($dangerMessages)) {
    notifDanger($dangerMessages);
} ?>
<form method="post" class="leftForm sign">
    <label for="email">E-mail:
        <input type="email" name="email">
    </label>

    <label for="password">Password:
        <input type="password" name="password">
    </label>

    <input type="submit" value="SUBMIT">
</form>
<a href="/?signup=true">Switch to signup</a>