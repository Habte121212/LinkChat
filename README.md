# LinkChat Frontend Structure

This project uses a modern, modular file structure for a scalable React chat application with authentication and real-world UX flows.

## Main Structure

```
client/
  src/
    App.jsx
    App.css
    main.jsx
    style.scss
    _mixins.scss

    components/
      chat/
        ChatWindow.jsx
        ChatWindow.scss
      contactlist/
        ContactList.jsx
        ContactList.scss
        index.js
        themeOptions.js
      message/
        MessageItem.jsx
        MessageItem.scss
      profile/
        Profile.jsx
        Profile.scss
      shared/
        Loader.jsx
        Loader.scss
        Modal.jsx
        Modal.scss

    page/
      home/
        Home.jsx
        home.scss
      login/
        Login.jsx
        login.scss
        ForgotPassword.jsx
        forgotPassword.scss
        ResetPassword.jsx
        resetPassword.scss
      register/
        Register.jsx
        register.scss
        VerifyEmail.jsx
      verifications/
        VerifyEmail.jsx
        verifyEmail.scss
    pages/
      index.js
```

## Structure Notes

- **components/**: Shared and feature-specific UI components, each with their own SCSS.
- **page/**: Route-level React pages, grouped by feature (login, register, home, verifications).
- **Style files**: Each component/page has a colocated SCSS file for maintainability.
- **Theme**: Theme options and switcher logic are in `contactlist/themeOptions.js`.
- **No duplicate or legacy folders**: Structure is clean and scalable.

## Auth & UX Flows

- **Forgot Password**: `/page/login/ForgotPassword.jsx` (sends reset link, shows notification)
- **Reset Password**: `/page/login/ResetPassword.jsx` (handles reset link, new password entry)
- **Email Verification**: `/page/verifications/VerifyEmail.jsx` (handles verification link, notifications)
- **Modern UI**: All forms use glassmorphism, gradients, and responsive layouts.

---

For backend/server structure, see the `server/` folder. For more details, see the code in each file.

---

# Original Vite/React Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
