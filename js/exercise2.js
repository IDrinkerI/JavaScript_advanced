class Form {
    constructor(selector) {
        this._form = document.querySelector(selector);

        this._nameField = this._createField();
        this._phoneField = this._createField();
        this._emailField = this._createField();

        this._textarea = document.createElement("textarea");
        this._textarea.classList.add("form-field");

        this._button = document.createElement("button")
        this._button.classList.add("form-btn");
        this._button.innerText = "Submit";
        this._button.setAttribute("type", "submit");
        this._button.onclick = this._onclickButtonHandler;

        this._form.append(this._nameField);
        this._form.append(this._phoneField);
        this._form.append(this._emailField);
        this._form.append(this._textarea);
        this._form.append(this._button);
    }

    _createField() {
        let newField = document.createElement("input");
        newField.setAttribute("type", "text");
        newField.classList.add("form-field");
        return newField;
    }


    _onclickButtonHandler(event) {
        event.preventDefault();

    }
}

new Form(".form");