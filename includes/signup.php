<?php

$dangerMessage = signup();

?>

<h1 class="title">SIGN UP</h1>
<?php if ($dangerMessage != "") {
    notifDanger($dangerMessage);
} ?>
<form action="" method="post" class="leftForm sign">
    <input type="text" hidden name="signup" value="true">
    <label for="email">E-mail:
        <input type="email" name="email">
    </label>

    <label for="password">Password: <input type="password" name="password"></label>
    <label for="passwordConfirm">Confirm Password: <input type="password" name="passwordConfirm"></label>

    <input type="submit" value="SIGN UP">
</form>
<a href="/">Switch to login</a>