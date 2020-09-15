<?php
$dangerMessage = login();
?>

<h1 class="title">LOGIN</h1>
<?php if ($dangerMessage != "") {
    notifDanger($dangerMessage);
} ?>
<form action="" method="post" class="leftForm sign">
    <input type="text" hidden name="login" value="true">
    <label for="email">E-mail:
        <input type="email" name="email">
    </label>

    <label for="password">Password: <input type="password" name="password"></label>

    <input type="submit" value="SUBMIT">
</form>
<a href="/?signup=true">Switch to signup</a>