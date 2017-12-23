function submitHappinessEntry() {
    submission = $("#happinessSubmission").val();
    if (isEmpty(submission)) { return; }

    var newSubmissionKey = firebase.database().ref().child('submissions').push().key;
    var updates = {};
    updates['/submissions/' + newSubmissionKey] = submission;
    firebase.database().ref().update(updates);
    alert('Thanks for your submission! I hope you have a happy day 😊');
    $("#happinessSubmission").val('');
}

function isEmpty(str) {
    return !str || str.length === 0 || !str.trim();
}
