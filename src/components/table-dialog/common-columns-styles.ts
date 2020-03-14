import { css, unsafeCSS } from 'lit-element';
import formsCss from 'purecss/build/forms-min.css';
import buttonCss from 'purecss/build/buttons-min.css';
import tableCss from 'purecss/build/tables-min.css';

export default css`
  ${unsafeCSS(formsCss)}
  ${unsafeCSS(buttonCss)}
  ${unsafeCSS(tableCss)}

  .add-column {
    margin-top: 10px;
  }

  td.no-column {
    text-align: center;
    color: #AAA;
  }

  .container {
    margin-top: 30px;
  }

  .title {
    margin-bottom: 10px;
  }
}`;