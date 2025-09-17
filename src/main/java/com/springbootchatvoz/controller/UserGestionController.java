package com.springbootchatvoz.controller;

import com.springbootchatvoz.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Set;

@Controller
public class UserGestionController {
    @Autowired
    private  UserService userService;
    @Autowired
    SimpMessagingTemplate template;

    @RequestMapping(value = "/usersGest",method = RequestMethod.GET)
    public Set<String> getUsers() {

        return userService.getUsers();
    }

    @RequestMapping(value = "/usersGest/{name}",method = RequestMethod.DELETE)
    public void deleteUsers(@PathVariable String name) {
        userService.deleteUser(name);
        template.convertAndSend("/topic/user/message", new User(name,"Finish session"));
    }
}
