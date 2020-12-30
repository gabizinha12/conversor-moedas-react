import "./conversor-moedas.css";
import {
  Jumbotron,
  Button,
  Form,
  Col,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import ListarMoedas from "./listar-moedas";
import { useState } from "react";
import axios from "axios";

function ConversorMoedas() {
  const FIXER_URL =
    "http://data.fixer.io/api/latest?access_key=5ba588dfc4d5cdcbc28a03986b3502e1";
  const [valor, setValor] = useState("1");
  const [moedaDe, setMoedaDe] = useState("BRL");
  const [moedaPara, setMoedaPara] = useState("USD");
  const [exibirSpinner, setExibirSpinner] = useState();
  const [formValidado, setFormValidado] = useState(false);
  const [exibirModal, setExibirModal] = useState(false);
  const [resultadoConversao, setResultadoConversao] = useState("");
  const [exibirMsgErro, setExibirMsgErro] = useState(false);

  function handleValor(event) {
    setValor(event.target.value.replace(/\D/g, ""));
  }

  function handleMoedaDe(event) {
    setMoedaDe(event.target.value);
  }
  function handleMoedaPara(event) {
    setMoedaPara(event.target.value);
  }

  function handleFecharModal(event) {
    setValor("1");
    setMoedaDe("BRL");
    setMoedaPara("USD");
    setFormValidado(false);
    setExibirModal(false);
  }

  function converter(event) {
    event.preventDefault();
    setFormValidado(true);
    if (event.currentTarget.checkValidity() === true) {
      setExibirSpinner(true);
      axios
        .get(FIXER_URL)
        .then((res) => {
          const cotacao = obterCotacao(res.data);
          if (cotacao) {
            setResultadoConversao(
              `${valor} ${moedaDe} = ${cotacao} ${moedaPara}`
            );
            setExibirModal(true);
            setExibirSpinner(false);
            setExibirMsgErro(false);
          } else {
            exibirErro();
          }
        })
        .catch((err) => exibirErro());
    }
  }

  function obterCotacao(dadosCotacao) {
    if (!dadosCotacao || dadosCotacao.success !== true) {
      return false;
    }
    const cotacaoDe = dadosCotacao.rates[moedaDe];
    const cotacaoPara = dadosCotacao.rates[moedaPara];
    const cotacao = (1 / cotacaoDe) * cotacaoPara * valor;
    return cotacao.toFixed(2);
  }

  function exibirErro() {
    setExibirMsgErro(true);
    exibirSpinner(false);
  }
  return (
    <div>
      <h1 className="text-center mt-2">Conversor de Moedas</h1>
      <Alert variant="danger" show={exibirMsgErro}>
        Erro obtendo dados de conversão, tente novamente
      </Alert>
      <Jumbotron>
        <Form onSubmit={converter} noValidate validated={formValidado}>
          <Form.Row>
            <Col sm="3">
              <Form.Control
                placeholder="0"
                value={valor}
                onChange={handleValor}
                required
              />
            </Col>
            <Col sm="3">
              <Form.Control
                as="select"
                value={moedaDe}
                onChange={handleMoedaDe}
              >
                <ListarMoedas />
              </Form.Control>
            </Col>
            <Col sm="1" className="text-center" style={{ paddingTop: "5px" }}>
              <FontAwesomeIcon icon={faAngleDoubleRight}></FontAwesomeIcon>
            </Col>
            <Col sm="3">
              <Form.Control
                as="select"
                value={moedaPara}
                onChange={handleMoedaPara}
              >
                <ListarMoedas />
              </Form.Control>
            </Col>
            <Col sm="2">
              <Button
                variant="warning"
                type="submit"
                style={{ marginLeft: "20px" }}
                data-testid="btn-converter"
              >
                <span className={exibirSpinner ? null : "hidden"}>
                  <Spinner animation="border" size="sm" />
                </span>
                <span className={exibirSpinner ? "hidden" : null}>
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ marginRight: "5px" }}
                  ></FontAwesomeIcon>
                  Converter
                </span>
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal show={exibirModal} onHide={handleFecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>Conversão</Modal.Title>
          </Modal.Header>
          <Modal.Body>{resultadoConversao}</Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={handleFecharModal}>
              <FontAwesomeIcon
                icon={faDollarSign}
                style={{ marginRight: "5px" }}
              ></FontAwesomeIcon>
              Nova conversão
            </Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    </div>
  );
}

export default ConversorMoedas;
