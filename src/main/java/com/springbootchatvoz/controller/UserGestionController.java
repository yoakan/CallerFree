package com.springbootchatvoz.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
public class UserGestionController {
    @Autowired
    private  UserService userService;
    @Autowired
    SimpMessagingTemplate template;

    @RequestMapping(value = "/usersGest",method = RequestMethod.GET)
    @ResponseBody
    public Set<String> getUsers() {

        return userService.getUsers();
    }
    @RequestMapping(value = "/usersGest/{name}",method = RequestMethod.GET)
    @ResponseBody
    public String addUser(@PathVariable String name) {

        userService.addUser(name);
        return "Sucefull";
    }

    @RequestMapping(value = "/usersGest/{name}",method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteUsers(@PathVariable String name) {
        userService.deleteUser(name);
        return ResponseEntity.ok("Succefull");
    }
}
