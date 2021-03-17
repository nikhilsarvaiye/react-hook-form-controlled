# Client Application Coding Guidelines

## Naming

1. Use lower case names for folder, file path which is general of javascript naming conventions
        <br />
e.g.
    >folder -> promotion-search
    <br />
    file -> promotion-search.component.js
    <br />
    file -> promotion-search.test.js
    <br />
    file -> promotion-search.fake.json

2. Do use
    - singlular and plural names to component
    e.g. claim.component.js
    - plural names for folders
    e.g utils, shared, modules
3. Do not use
- Words like custom, object, item, consumer, data which are more of technical terminologies. <br />
Try to use functional names, basically purpose of that function/component/class
4. Input function names and method implementation naming,

        onChange - component props name
        handleChange - method name
    > 
        onSearch - component props name
        handleSearch - method name   

## Import
1. Use Below Hierarchy and import order
		
        further -> top      e.g. external library
		closest -> down     e.g folder files

		react libraries
		other libraries
		@core libraries
		@library folder component
		@utils
		@shared
		@modules
		parent
		folder
		
2. Using absolute path instead of relative with the help of alias
    e.g.
    import { onkeyDownDate, onBlurDate } from './../../../util/date';		
    import { onkeyDownDate, onBlurDate } from '@util/date';
    
    to use above alias, two type of configurations are needed,
    1. Webpack Alias configurations so that while bundling webpack knows actual path for alias
    2. jsconfig.json path configurations for intellisense
    3. Optional - if your using Jest for Unit Test, configurations for path in jest.config file

## Export

1. index.js
    - Use of index.js file where you can export all the folder components can be very useful for the user        who is going to import your component, functions, etc.

    - you can have index.js file at folder level like below       directory structure
			
grid
        
        file grid.component.js -> exports GridComponent
        
        file grid-filter.component.js -> exports GridFilterComponent
        
        file index.js - exports GridComponent and GridFilterComponent both

normal usage
<br />
`import { GridComponent } from './shared/components/grid/grid.component.js'`

better usage using index.js file
<br />
`import { GridComponent, GridFilterComponent } from './shared/components/grid'`


## Directory Structure

Please Follow directory structure in below format:

`library` - <em>here code has no dependancy of application logic</em>

`components` - <em>here code has no dependancy of application UI, but has dependancy of application components and can be used across multiple projects</em>

`screens` - <em>dependancy of domain/application logic</em>

+ library
    + components
        + core
            + auto-complete
                + `auto-complete.js`
                + `auto-complete.scss`
            + date-picker
                + `date-picker.js`
                + `date-picker.scss`
        + query-builder
            + `query-builder.js`
            + `query-builder.config.js`
    + utils
        + form-to-bundle-tranlator
            + `form-to-bundle-tranlator.js`
    + styles
        + theme
            + `theme.scss`
+ screens
    + shared
	    + components
				+ country
                    + `country.js`
                    + `country.store.js`
                + state
                    + `state.js`
                    + `state.scss`
	    + services
            + country
                + `country.service.js`

	+ promotion
        + information
            + `promotion-information.js`
            + `promotion-information.store.js`
        + insurance
            + `promotion-insurance.js`
            + `promotion-insurance.scss`
        + promotion.js
        + index.js

    + employee
        + information
            + `employee-information.js`
            + `employee-information.store.js`
        + document
            + `employee-document.js`
            + `employee-document.scss`
    + document.js
    + index.js

## Services

### Using async await

- Do use async await using ES6 functions. You can also use it with React fetch/axios api's. Check below example:

        const fetchData = async () => {
            return fetch('https://randomuser.me/api/')
        }

        const printData = async () => {
            try {
                const data = await fetchData()
                console.log(data)
            } catch(e) {
                console.error("Problem", e)
            }
        }


### Using Axio's over fetch, some important differences
-   Request
    - 	To send data, fetch()  uses the body property, while axios uses the data property
    -	The URL is passed as an argument to fetch(). In axios, however, the URL is set in the options object
-	Response 
    -	The response data in fetch() is stringified, whereas in axios in json.
    -	simple way to setting timeout in timeout in axios as below, whereas in fetch() provides similar functionality through the AbortController interface
-	Backward browser compatibility
-	Http Interceptors
-	Post Request/Download progress
-	Simultaneous async await requests Using .all methods
-	Better Error Handling for axios
-   Create axios instance and use for all services, e.g below:

        import axios from 'axios';
        import { requestHandler, successHandler, errorHandler } from './api.interceptor';

        const api = axios.create({
            baseURL: 'https://localhost:44306',
        });

        api.interceptors.request.use(request => requestHandler(request));

        api.interceptors.response.use(
            response => successHandler(response),
            error => errorHandler(error),
        );

        export { api as Api };

## Code Formatting with Prettier

- Prettier is a nice extension to format all of your using multiple options. Using Prettier Configuration files to set formatting options is the recommended approach.
- Below example for file configuration we should use,
file - <em>.prettierrc</em>

        {
            "trailingComma": "all",
            "singleQuote": true,
            "tabWidth": 4
        }

## Components

- Do create functional component with latest React hooks.
  A pure function/component which means they are totally depends on the input parameters they receive and return testable output
  Please check below example:

        import React from 'react';
        import { Avatar } from './avatar';
        import './avatar.scss';

        const userName = ({userName}) => {
            return (
                <div className="avatar">
                    <Avatar shape="circle" type="image">
                        <img alt="avatar" src="/images/user.png" />
                    </Avatar>
                    <span>{userName}</span>
                </div>
            );
        };
        export { userName as UserName }

- Seperating service logic from Component
    - Try to create componet without using service directly in components. We can keep the service calls in the host component where the component is getting rendered and pass service response data as input to our component.
    - If you stil want to wrap data and service logic in component, we can create another wrapper component around original component and pass service input data to it.
    - This way, we can create reusbality of both the components.
