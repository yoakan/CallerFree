package com.springbootchatvoz.controller;

import com.springbootchatvoz.model.User;
import com.springbootchatvoz.model.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {
    @Autowired
    private  UserService userService;


    @MessageMapping("/user/message")
    @SendTo("/topic/user/message")
    public UserResponse sendMessage(User user) {
        userService.addUser(user.getName());
        return new UserResponse( user.getName(),user.getVoice());
    }


}
