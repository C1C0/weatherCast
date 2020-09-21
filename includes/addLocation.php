<h1 class="title">ADD A LOCATION</h1>
<?php if ($dangerMessages != "") {
    notifDanger($dangerMessages);
} ?>
<form class="leftForm adding" id="locationForm">
    <label for="location">Location: 
        <input type="text" name="location">
    </label>

    <input type="submit" value="ADD">
</form>

<script>initLocationForm();</script>