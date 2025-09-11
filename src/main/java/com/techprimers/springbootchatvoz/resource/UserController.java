package com.techprimers.springbootchatvoz.resource;

import com.techprimers.springbootchatvoz.model.User;
import com.techprimers.springbootchatvoz.model.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
public class UserController {
    @Autowired
    SimpMessagingTemplate template;

    private Set<String> users = new HashSet<>();
    @MessageMapping("/user/message")
    @SendTo("/topic/user/message")
    public UserResponse sendMessage(User user) {
        users.add(user.getName());
        return new UserResponse( user.getName(),user.getVoice());
    }

    @RequestMapping(value = "/users",method = RequestMethod.GET)
    public Set<String> getUsers() {

        return users;
    }

    @RequestMapping(value = "/users/{name}",method = RequestMethod.DELETE)
    public void deleteUsers(@PathVariable String name) {
            users.remove(name);
        template.convertAndSend("/topic/user", new UserResponse(name,"Finish session"));
    }
}
