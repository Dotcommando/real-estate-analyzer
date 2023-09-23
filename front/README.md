# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Local Run with Gateway

Create `.env` file in the `front` directory. Fill it with these values:

    REACT_APP_MODE=dev
    REACT_APP_ORIGIN_PROTOCOL=http   # http for local requests
    REACT_APP_ORIGIN_HOST=localhost  # It's a host of gateway, technically there is a domain of the service expected
    REACT_APP_ORIGIN_PORT=3332       # It's a port of gateway
    REACT_APP_API_PREFIX=/api/v1     # Our API prefix
    REACT_APP_FRONT_HOST=localhost   # host of the front app
    REACT_APP_FRONT_PORT=3000        # port of the front app

In `gateway` use these values for `.env`:

    MODE=dev
    MONGO_INITDB_DATABASE=data-storage
    MONGO_INITDB_ROOT_USERNAME=alphared
    MONGO_INITDB_ROOT_PASSWORD=jgNruNysQ8w5bN
    MONGO_HOST=localhost        # Expects, that DB runs in Docker 
    MONGO_PORT=27077
    MONGO_COLLECTIONS=["rentapartmentsflats","renthouses","saleapartmentsflats","salehouses"]
    GATEWAY_PROTOCOL=http
    GATEWAY_HOST=localhost
    GATEWAY_PORT=3332
    ORIGIN_PROTOCOL=http        # http for local run
    ORIGIN_HOST=localhost       # Front host
    ORIGIN_PORT=3000            # Front port
