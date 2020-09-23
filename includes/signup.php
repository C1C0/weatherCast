<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    signup();
}

?>

<h1 class="title">SIGN UP</h1>
<?php if ($dangerMessages != "") {
    notifDanger($dangerMessages);
} ?>
<form action="" method="post" class="leftForm sign">
    <label for="email">E-mail:
        <input type="email" name="email">
    </label>

    <label for="password">Password: <input type="password" name="password"></label>
    <label for="passwordConfirm">Confirm Password: <input type="password" name="passwordConfirm"></label>

    <input type="submit" value="SIGN UP">
</form>
<a href="/">LOGIN</a>