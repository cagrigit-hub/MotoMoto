# Use the official MongoDB image as the base image
FROM mongo:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Expose the default MongoDB port
EXPOSE 27017

# Start MongoDB when the container starts
CMD ["mongod"]
