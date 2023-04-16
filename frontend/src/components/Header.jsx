import React, { useState } from "react";
import {
  Flex,
  createStyles,
  Header,
  Anchor,
  Center,
  Container,
  rem,
  Image,
  BackgroundImage,
  Menu,
  Button,
  Group,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { EasyChefBanner, EasyChefLogo } from "../assets/images";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  Container: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export default function HeaderSimple({ props }) {
  const links = props;
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, theme, cx } = useStyles();

  const [auth, setAuth] = useLocalStorage({
    key: "access_token",
    defaultValue: null,
  });

  const items = links.map((link) => (
    <Anchor
      component={Link}
      key={link.label}
      to={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        //event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </Anchor>
  ));

  const renderAuth = () => {
    return (
      <>
        {!auth ? (
          <>
            <Menu.Item component={Link} key="Login" to="/login">
              Login
            </Menu.Item>
            <Menu.Item component={Link} key="Register" to="/register">
              Register
            </Menu.Item>
          </>
        ) : (
          <Menu.Item component={Link} key="Logout" to="/logout">
            Logout
          </Menu.Item>
        )}
      </>
    );
  };

  const renderProfile = () => {
    return (
      <>
        <Menu.Item component={Link} key="Shopping List" to="/shopping-list">
          My Shopping List
        </Menu.Item>
        <Menu.Item component={Link} key="Profile" to="/profile">
          Edit Profile
        </Menu.Item>
      </>
    );
  };

  return (
    <Header fixed height={265} sx={{ display: "block" }}>
      <BackgroundImage
        mah={205}
        mih={205}
        src={EasyChefBanner}
        sx={{
          backgroundSize: "cover",
        }}
      >
        <Center>
          <Image src={EasyChefLogo} height={175} width="auto" mt="15px" />
        </Center>
      </BackgroundImage>
      <Container
        fluid
        p={0}
        m={0}
        sx={{ backgroundColor: theme.colors.gray[3] }}
      >
        <Group mih={60} gap="sm" position="center" className={classes.links}>
          {items}
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <Button variant="white" color="dark">
                Profile
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {renderProfile()}
              <Menu.Divider />
              {renderAuth()}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </Header>
  );
}
