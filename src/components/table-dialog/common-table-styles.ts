import { css } from 'lit-element';

export default css`
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