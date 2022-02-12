# backendConnect
There are a few files here that are the major changes from the original backend tests.
Number 1 you have to add in cors for cross origin resource sharing and cookie parser in server.ts
Cors allows you to go across files and share the resources so that server and ui can be connected. Add in the origin point
pulled from config to have the right origin point, credentials also need to be true in case you want cookies to be shared across the 
folders.
Next fetcher.ts basically is a glorified axios get request that you are going to need for the useSwr hook. make sure withCredentials
are there as well. The inputs are going to be a url string and an empty object headers.
Make sure to add in cookies and cookie options into deserialize user and session controller wherever tokens have to be created for now
the tokens are going to be put into the cookies. The cookie options are going to be objects that have maxAge, domain(from config),
secure(boolean from config), path, httpOnly, sameSite in it. Make sure you create it for both access and refresh tokens and res.send them.
In deserialize user also add in get access and refresh token from req.cookies.
Make sure getUserHandler which gets and res send user from res.locals.user happens and make sure to add it into routes as well.
Here the getUser will only need requireUser.
In server(backend) default config make sure you put in the things that you need to add in to make it work like domain, secure, and origin.
In .env.local make sure that you add in the NEXT_PUBLIC_SERVER in order to hide it.
Then in index.ts all that you are doing is using serverSideProps to pre load the info using axios/fetcher to pre-fetch info and then
throwing it into fallbackData in props. Which you take into the main function and useSwr to then load info from a temp cache, and
prevent the server from getting too flooded. Which needs the url, fetcher and the fallbackData in an object.
And finally in login and register all that you are doing is making the react form and then using useForm to add in the register, 
handleSubmit and FormState: {errors} so that you integrate them into the function instead of writing a thousand useStates.
Then just axios post the data in order to either create a session when you login or create a user when you register. Here you will be 
pushing values which are of the type of the schema that you will be putting into the useForm which will be sitting inside a resolver, and 
in our case a zod resolver. Useform will obviously be taking the type of the schema as that is what we expect.
