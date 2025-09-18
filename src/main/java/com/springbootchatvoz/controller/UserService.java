package com.springbootchatvoz.controller;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    private static Set<String> users = new HashSet<>();
    public  void addUser(String name){
        users.add(name);

    }
    public  void deleteUser(String name){
        users.remove(name);

    }
    public  Set<String> getUsers(){
        return  users;
    }
}
