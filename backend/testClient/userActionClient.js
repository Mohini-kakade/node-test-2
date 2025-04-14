const readline = require("readline");
const axios = require("axios");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiUrl = "http://localhost:5000";

const showLoginOption = () => {
  rl.question("Press 1 to login\nPress 2 to register: ", (option) => {
    if (option === "1") {
      rl.question("Enter your email: ", (email) => {
        rl.question("Enter your password: ", (password) => {
          authenticateUser(email, password);
        });
      });
    } else if (option === "2") {
      registerUser();
    } else {
      console.log("Invalid option. Exiting...");
      rl.close();
    }
  });
};

const authenticateUser = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, {
      email,
      password,
    });
    const token = response.data.token;
    console.log("Successfully logged in!");

    showPostOptions(token);
  } catch (error) {
    console.error("Error logging in:", error.response.data.msg);
    rl.close();
  }
};

const registerUser = () => {
  rl.question("Enter your name: ", (name) => {
    rl.question("Enter your email: ", (email) => {
      rl.question("Enter your password: ", (password) => {
        rl.question("Enter your phone: ", (phone) => {
          rl.question("Enter your address: ", (address) => {
            rl.question("Enter your role (admin/user): ", (role) => {
              registerNewUser(name, email, password, phone, address, role);
            });
          });
        });
      });
    });
  });
};

const registerNewUser = async (name, email, password, phone, address, role) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, {
      name,
      email,
      password,
      phone,
      address,
      role,
    });
    console.log("Registration successful! You can now login.");
    rl.close();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      console.error("Validation errors:");
      error.response.data.errors.forEach((error) => {
        console.error(`${error.msg}`);
      });
    } else {
      console.error("Unexpected error during registration:", error.message);
    }
    rl.close();
  }
};

const showPostOptions = (token) => {
  rl.question(
    "\nYou are logged in! Choose an option:\n1. Chat\n2. Manage Posts\n",
    (option) => {
      if (option === "1") {
        showChatOption(token);
      } else if (option === "2") {
        managePosts(token);
      } else {
        console.log("Invalid option, exiting...");
        rl.close();
      }
    }
  );
};

const managePosts = (token) => {
  rl.question(
    "\nManage Posts - Choose an option:\n1. Create Post\n2. View All Posts\n3. View Specific Post\n4. Update Post\n5. Delete Post\n",
    (option) => {
      switch (option) {
        case "1":
          createPost(token);
          break;
        case "2":
          viewAllPosts(token);
          break;
        case "3":
          viewSpecificPost(token);
          break;
        case "4":
          updatePost(token);
          break;
        case "5":
          deletePost(token);
          break;
        default:
          console.log("Invalid option, exiting...");
          rl.close();
      }
    }
  );
};

const createPost = async (token) => {
  rl.question("Enter post title: ", (title) => {
    rl.question("Enter post description: ", (description) => {
      rl.question("Enter post content: ", async (content) => {
        try {
          const response = await axios.post(
            `${apiUrl}/posts/create`,
            { title, description, content },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Post created successfully:", response.data);
          showPostOptions(token);
        } catch (error) {
          if (error.response && error.response.data.errors) {
            console.error("Validation errors:");
            error.response.data.errors.forEach((error) => {
              console.error(`${error.msg}`);
            });
          } else {
            console.error(
              "Unexpected error during registration:",
              error.message
            );
          }
          showPostOptions(token);
        }
      });
    });
  });
};

const viewAllPosts = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("All Posts:", response.data);
    showPostOptions(token);
  } catch (error) {
    console.error("Error fetching posts:", error.response.data);
    showPostOptions(token);
  }
};  

const viewSpecificPost = async (token) => {
  rl.question("Enter the post ID to view: ", async (postId) => {
    try {
      const response = await axios.get(`${apiUrl}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Post Details:", response.data);
      showPostOptions(token);
    } catch (error) {
      console.error("Error fetching post:", error.response.data);
      showPostOptions(token);
    }
  });
};

const updatePost = async (token) => {
  rl.question("Enter the post ID to update: ", (postId) => {
    rl.question("Enter new post title: ", (title) => {
      rl.question("Enter new post description: ", (description) => {
        rl.question("Enter new post content: ", async (content) => {
          try {
            const response = await axios.put(
              `${apiUrl}/posts/${postId}`,
              { title, description, content },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Post updated successfully:", response.data);
            showPostOptions(token);
          } catch (error) {
            console.error("Error updating post:", error.response.data);
            showPostOptions(token);
          }
        });
      });
    });
  });
};

const deletePost = async (token) => {
  rl.question("Enter the post ID to delete: ", async (postId) => {
    try {
      const response = await axios.delete(`${apiUrl}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Post deleted successfully:", response.data);
      showPostOptions(token);
    } catch (error) {
      console.error("Error deleting post:", error.response.data);
      showPostOptions(token);
    }
  });
};

const showChatOption = (token) => {
  rl.question(
    "You are logged in! Type your question to chat with AI: ",
    (question) => {
      chatWithAI(token, question);
    }
  );
};

const chatWithAI = async (token, question) => {
  try {
    const response = await axios.post(
      `${apiUrl}/chat`,
      { message: question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("AI Response:", response.data.reply);
    rl.question(
      "Ask another question or type 'exit' to quit: ",
      (nextQuestion) => {
        if (nextQuestion.toLowerCase() === "exit") {
          console.log("Goodbye!");
          rl.close();
        } else {
          chatWithAI(token, nextQuestion);
        }
      }
    );
  } catch (error) {
    console.error("Error in chat:", error.response.data.reply);
    rl.close();
  }
};

showLoginOption();
