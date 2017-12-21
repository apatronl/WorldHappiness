function submitHappinessEntry() {
    console.log("Submit button pressed");
    submission = $("#happinessSubmission").val();
    if (isEmpty(submission)) { return; }

    console.log(submission);

    var newSubmissionKey = firebase.database().ref().child('submissions').push().key;

    var updates = {};
    updates['/submissions/' + newSubmissionKey] = submission;

    return firebase.database().ref().update(updates);
}

function isEmpty(str) {
    return !str || str.length === 0 || !str.trim();
}
