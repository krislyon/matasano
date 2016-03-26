def encrypt_singlebyte_xor( plain_text, key ):
    cipher_text = bytearray(plain_text)
    i=0
    for b in plain_text:
        cipher_text[i] = plain_text[i] ^ key
        i+=1
    return cipher_text

def encrypt_otp_xor( plain_text, key ):
    cipher_text = bytearray(plain_text)
    i=0
    for b in plain_text:
        cipher_text[i] = plain_text[i] ^ key[i]
        i+=1
    return cipher_text

def encrypt_rotating_xor( plain_text, key ):
    key_length = len( key )
    cipher_text = bytearray(plain_text)
    key_pos=0
    text_pos=0

    for b in plain_text:
        cipher_text[text_pos] = plain_text[text_pos] ^ key[key_pos]
        text_pos+=1
        key_pos+=1
        if key_pos >= key_length:
            key_pos=0
    return cipher_text
