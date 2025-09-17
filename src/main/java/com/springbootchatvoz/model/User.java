package com.springbootchatvoz.model;

import java.io.InputStream;

public class User {

    private String name;
    private String voice;

    public User() {
    }
    public User(String name,String voice) {
        this.name = name;
        this.voice = voice;
    }
    public User(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getVoice() {
        return voice;
    }


}
