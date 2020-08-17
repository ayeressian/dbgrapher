import { css } from "lit-element";

export default css`
  .operation-icon {
    width: 75px;
    height: 100px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .operation-icon-container {
    width: fit-content;
    height: 100px;
    display: inline-block;
  }

  .operation {
    font-weight: bold;
  }

  .body {
    display: flex;
  }

  .header {
    width: 100%;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }

  .operation-container {
    padding: 10px;
    margin: 10px;
    width: 200px;
    text-align: center;
    background-color: white;
  }

  .operation-container:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.05);
    background-blend-mode: multiply;
  }
`;
