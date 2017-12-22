function submitHappinessEntry() {
    submission = $("#happinessSubmission").val();
    if (isEmpty(submission)) { return; }

    var newSubmissionKey = firebase.database().ref().child('submissions').push().key;
    var updates = {};
    updates['/submissions/' + newSubmissionKey] = submission;
    return firebase.database().ref().update(updates);
}

function isEmpty(str) {
    return !str || str.length === 0 || !str.trim();
}

// Thanks for your submission. Once I've received enough submissions I'll share another visualization
