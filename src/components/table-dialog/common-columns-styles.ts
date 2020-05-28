import { css, unsafeCSS } from 'lit-element';
import formsCss from 'purecss/build/forms-min.css';
import buttonCss from 'purecss/build/buttons-min.css';
import tableCss from 'purecss/build/tables-min.css';
import removeSvg from '../../../asset/remove.svg';

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

  .table-container {
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    display: inline-block;
  }

  .table-container table th {
    background-color: #E0E0E0;
    position: sticky;
    top: 0;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .table-container table {
    border-collapse: collapse;
  }

  .add-column {
    display: block;
  }

  .remove-icon {
    width: 32px;
    height: 32px;
    background-image: url(${unsafeCSS(removeSvg)});
    background-size: cover;
  }
}`;