function validatePresenceOfUsernameAndEmail(query) {
    let errors = [];
    if(!query.username) {
        errors.push("Username is required");
    }

    if(!query.email) {
        errors.push("Email is required");
    }

    return errors;
}


function validateEmailFormat(email) {
   
    if(!(email.includes("@") && email.includes("."))) {
        return "Invalid email format";
    }

    return null;
  
}


function validateImageUrl(imageUrl) {
    if(!imageUrl || !(imageUrl.startsWith("https://images.unsplash.com/"))) {
        return false;
    }

    return true;
}


function validateTagsLength(tags) {
    if(tags.length > 5) {
        return false;
    }

    return true;
}


function validateTagLength(tags) {
    for(const tag of tags) {
        if(tag.length > 20) {
            return false;
        }
    }

    return  true;
}


function containsNonEmptyStrings(tags) {
    if(!Array.isArray(tags) || tags.length === 0 || !tags.every(tag => typeof tag === "string" && tag.trim() !== "")) {
        return false;
    }

    return true;
}

module.exports = { validatePresenceOfUsernameAndEmail, validateEmailFormat, validateImageUrl, validateTagsLength, validateTagLength, containsNonEmptyStrings };