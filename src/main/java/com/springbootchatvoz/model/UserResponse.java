package com.springbootchatvoz.model;

import java.io.InputStream;

public class UserResponse {
    String name;
    String voice;

    public String getVoice() {
        return voice;
    }





    public UserResponse() {
    }

    public String getName() {
        return name;
    }

    public UserResponse(String name,String voice) {
        this.name = name;
        this.voice = voice;
    }
    public UserResponse(String name) {
        this.name = name;
    }
}
