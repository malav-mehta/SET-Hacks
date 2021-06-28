import { Col, Container, Row } from "react-bootstrap";

import Heading from "./Heading";
import Link from "./Link";
import React from "react";
import styled from "styled-components";

const StyledFrame = styled(Col)`
  background-image: linear-gradient(
    ${({ theme }) => theme.colors.secondaryVariant},
    ${({ theme }) => theme.colors.white}
  );
  border-radius: ${({ theme }) => theme.borderRadius["2xl"]};
  padding: 0.8rem;
`;

const StyledTerminal = styled.div`
  background-color: ${({ theme }) => theme.colors.brand[900]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 2.4rem;
`;

const StyledHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 400px;
  width: 100%;
  overflow: auto;
`;

const StyledHeading = styled(Heading)`
  color: ${({ theme }) => theme.colors.white};
`;

const StyledPromptText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  margin: 0 0.5rem 0 0;
`;

const StyledCommandResult = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const StyledForm = styled.form`
  flex-grow: 1;
`;

const StyledPromptInput = styled.input`
  background-color: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.secondaryVariant};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes["md"]};
  font-weight: 600;
  margin: 0;
  padding: 0;
  width: 100%;

  &:focus-visible {
    border: 0;
    outline: 0;
  }
`;

type PromptProps = {
  active: boolean;
  val: string;
  submitCommand: (command: string) => void;
  id: string;
};

const Prompt = ({ active, val, submitCommand, id }: PromptProps) => {
  const [command, setCommand] = React.useState<string>(val);
  const [disabled, setDisabled] = React.useState<boolean>(!active);

  const handleChange = (event) => {
    setCommand(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (command === "") return;
    setDisabled(true);
    submitCommand(command);
  };

  return (
    <div className="d-flex align-items-center flex-start" id={id}>
      <StyledPromptText>$</StyledPromptText>
      <StyledForm onSubmit={handleSubmit}>
        <StyledPromptInput
          onChange={handleChange}
          disabled={disabled}
          value={command}
        />
        <button type="submit" hidden={true}></button>
      </StyledForm>
      <StyledPromptText style={{ opacity: 0.45 }}>
        press [enter]
      </StyledPromptText>
    </div>
  );
};

type TerminalCommandProps = {
  name: string;
  value: string;
};

type TerminalProps = {
  heading: string;
  commands: TerminalCommandProps[];
  link: {
    href: string;
    label: string;
  };
};

type TerminalHistoryProps = {
  isPrompt: boolean;
  active: boolean;
  val: string;
  id: string;
};

const Terminal = ({ heading, commands, link }: TerminalProps) => {
  const handleCommandSubmit = (command: string): void => {
    let value = "Unknown command.";
    const rnd = Math.floor(Math.random() * (commands.length - 1)) + 1;

    for (let i = 0; i < commands.length; ++i) {
      if (commands[i].name.toLowerCase() === command.toLowerCase()) {
        value = commands[i].value;
        break;
      }
    }

    let histCopy = [...terminalHistory];
    histCopy[histCopy.length - 1].active = false;
    let len = histCopy.length;
    setTerminalHistory([
      ...histCopy,
      { isPrompt: false, active: false, val: value, id: `t-hist-${len + 1}` },
      {
        isPrompt: true,
        active: true,
        val: commands[rnd].name,
        id: `t-hist-${len + 2}`,
      },
    ]);
  };

  const [terminalHistory, setTerminalHistory] = React.useState<
    TerminalHistoryProps[]
  >([
    {
      isPrompt: true,
      val: "ls",
      active: true,
      id: "t-hist-0",
    },
  ]);

  const R = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    let id = terminalHistory[terminalHistory.length - 1].id;
    let el = document.getElementById(id);
    if (el) {
      el.scrollIntoView();
      document.getElementById("t-hist").scrollIntoView();
    }
  });

  return (
    <Container>
      <Row>
        <StyledFrame className="mb-4">
          <StyledTerminal>
            <div className="w-100 d-flex justify-content-center align-items-center mb-3">
              <StyledHeading>{heading}</StyledHeading>
            </div>
            <StyledHistoryWrapper ref={R}>
              {terminalHistory.map((item, i) =>
                item.isPrompt ? (
                  <Prompt
                    key={i}
                    active={item.active}
                    val={item.val}
                    submitCommand={handleCommandSubmit}
                    id={item.id}
                  />
                ) : (
                  <StyledCommandResult key={i} id={item.id}>
                    {item.val}
                  </StyledCommandResult>
                )
              )}
            </StyledHistoryWrapper>
          </StyledTerminal>
        </StyledFrame>
      </Row>
      <Row>
        <Col>
          <Link href={link.href}>{link.label}</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Terminal;
