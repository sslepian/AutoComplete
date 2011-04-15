#AutoComplete

AutoComplete enhances a standards HTML INPUT element to provide auto-complete functionality from a list of predefined words. AutoComplete is written in HTML, CSS, and the MooTools framework, and requires MooTools Core as well as Element.Delegation from MooTools More.

##Usage

AutoComplete should to be initialized at a point after the HTML elements become accessible, such as on the *domready* event. To initialize AutoComplete, simply make a call to it passing the id of the INPUT element.

### HTML

    <input type="text" id="autocomplete"></input>

### JavaScript

    var autoComplete = new AutoComplete('autocomplete', {
        words: ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
    });