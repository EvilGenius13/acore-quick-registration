const IndexPage = () => {
  return (
    <html lang='en'>
      <head>
        <title>Account Registration</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/htmx.org@1.9.11" integrity="sha384-0gxUXCCR8yv9FM2b+U3FDbsKthCI66oH5IA9fHppQq9DDMHuMauqq1ZHBpJxQ0J0" crossorigin="anonymous"></script>
      </head>
      <style>
        {`
          .background-image {
            background-image: url('https://wow.zamimg.com/uploads/screenshots/normal/1059910.jpg');
            background-size: cover;
            background-position: center;
          }
        `}
      </style>
      <body class="flex items-center justify-center h-screen background-image">
        <div id="formContainer" class="max-w-lg mx-auto p-8 bg-white bg-opacity-80 rounded shadow-lg">
          <h1 class="text-3xl font-bold underline mb-6 text-center">Register your account</h1>
          <div id="responseMessage" class="text-center py-4"></div>
          <form hx-post="/register" hx-target="#responseMessage" hx-swap="innerHTML" hx-boost="true" id="registrationForm">
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
              <input type="text" id="username" name="username" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
              <input type="password" id="password" name="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div class="mb-6">
              <label for="verifyPassword" class="block text-sm font-medium text-gray-700">Verify Password:</label>
              <input type="password" id="verifyPassword" name="verifyPassword" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Register
            </button>
          </form>
          <div id="realmlistContainer" class="mt-4 p-2 rounded">
            <h2 class="text-lg font-bold">Realmlist Information</h2>
          </div>
        </div>
      </body>
    </html>
  );
};

export default IndexPage;
