class Form {
    constructor(selector, buttonHandler) {
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
        this._button.onclick = buttonHandler;

        this._addLabel("Name:");
        this._form.append(this._nameField);
        this._addLabel("Phone:");
        this._form.append(this._phoneField);
        this._addLabel("E-mail:");
        this._form.append(this._emailField);
        this._addLabel("Message:");
        this._form.append(this._textarea);
        this._form.append(this._button);

        this.namePattern = new MatchPatter(/[a-z_\-]+/i, "Имя должно содержать только буквы");
        this.phonePatter = new MatchPatter(/[+]{1}\d{1,3}\(\d{3,5}\)\d{3}-\d{4}/, "Телефон должен имееть вид +7(000)000-0000");
        this.emailPattern = new MatchPatter(/[a-z-.]+@[a-z]+(\.ru|\.com)/i, "E-mail имеет должен имееть вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.");
        this.textareaPattern = new MatchPatter();
    }

    checkForm() {
        this._checkField(this._nameField, this.namePattern);
        this._checkField(this._phoneField, this.phonePatter);
        this._checkField(this._emailField, this.emailPattern);
        this._checkField(this._textarea, this.textareaPattern);
    }

    _createField() {
        let newField = document.createElement("input");
        newField.setAttribute("type", "text");
        newField.classList.add("form-field");
        return newField;
    }

    _addLabel(content) {
        let newLabel = document.createElement("label");
        newLabel.classList.add("form-label");
        newLabel.innerText = content;
        this._form.append(newLabel);
    }

    _checkField(field, mathPattern) {
        let value = field.value;

        if (value.length == 0) {
            field.classList.add("form-incorrect");
            field.title = "Поле обязательно к заполнению";
            return;
        }

        let match = mathPattern.patter.exec(value);

        if (match == null || value.length != match[0].length) {
            field.title = mathPattern.requirement;
            field.classList.add("form-incorrect");
        }
        else {
            field.title = "";
            field.classList.remove("form-incorrect");
        }
    }
}

class MatchPatter {
    constructor(patter = /.+/, requirement = "") {
        this.patter = patter;
        this.requirement = requirement;
    }
}

const form = new Form(".form", (event) => {
    event.preventDefault();
    form.checkForm();
});