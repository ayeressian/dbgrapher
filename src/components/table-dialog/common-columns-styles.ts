import { css, unsafeCSS } from 'lit-element';
import formsCss from 'purecss/build/forms-min.css';
import buttonCss from 'purecss/build/buttons-min.css';
import tableCss from 'purecss/build/tables-min.css';

export default css`
  ${unsafeCSS(formsCss)}
  ${unsafeCSS(buttonCss)}
  ${unsafeCSS(tableCss)}

  table.hide {
    display: none;
  }

  table {
    margin-top: 20px;
    border: none;
    border-collapse: collapse;
  }
  th {
    text-align: left;
  }
  table td:first-child, table th:first-child {
    border-left: none;
  }
  table td, table th {
    border-left: 1px solid #AAA;
    padding: 3px 5px 3px 5px;
  }
  table tr:hover {
    background-color: #DDD;
  }
}`;