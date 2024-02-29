async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      console.log('Response status:', response.status);
  
      if (response.ok) {
        // Successful login, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Handle error response
        const error = await response.json();
        alert(error.message || 'An error occurred during login.');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error during login:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  }
  