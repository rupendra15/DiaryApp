package com.confession.diary.util;

import java.security.Key;
import javax.crypto.KeyGenerator;
import java.util.Base64;

public class GenerateBase64Key {

    public static String generateKey() throws Exception {
        // Generate a secret key using KeyGenerator
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        keyGen.init(256); // 256-bit key for strong encryption
        Key secretKey = keyGen.generateKey();

        // Convert the secret key to Base64 string
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }

    public static void main(String[] args) throws Exception {
        String base64Key = generateKey();
        System.out.println("Base64-Encoded Key: " + base64Key);
    }
}
