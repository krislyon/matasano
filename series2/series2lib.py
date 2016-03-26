from Crypto.Cipher import AES

def convert_array_to_hex( data ):
    return ''.join([format(v,'02x') for v in data])

def convert_hex_to_array( data ):
    return bytearray.fromhex( data.strip() )

def convert_array_to_ascii( data ):
    return ''.join(chr(i) for i in data )

def apply_pkcs7_padding( plain_text, block_size ):
    padding_size = len(plain_text) % block_size

    if( padding_size == 0 ):
        padding_size = block_size
    else:
        padding_size = block_size - padding_size

    result = plain_text + bytearray( [padding_size] * padding_size )
    return result


def trim_pkcs7_padding( plain_text ):
    padding_size = plain_text[-1] * -1;
    return plain_text[:padding_size]

def encrypt_otp_xor( plain_text, key ):
    cipher_text = bytearray(plain_text)
    i=0
    for b in plain_text:
        cipher_text[i] = plain_text[i] ^ key[i]
        i+=1
    return cipher_text

def encrypt_aes128_manual_cbc( plaintext, key, iv ):
    block_size=16
    cipher = AES.new( key )
    plaintext = apply_pkcs7_padding( plaintext, block_size )
    length = len( plaintext )
    ciphertext = bytearray(0)

    block_result = iv
    i=0
    while( i < length ):
        block = plaintext[i:i+block_size]
        block = encrypt_otp_xor( block, block_result )
        block_result = cipher.encrypt( str(block) )
        block_result = bytearray(block_result)
        ciphertext += block_result
        i+=block_size

    return ciphertext

def decrypt_aes128_manual_cbc( ciphertext, key, iv ):
    block_size=16
    cipher = AES.new( key )
    plaintext = bytearray(0)

    length = len( ciphertext )
    i=length
    block = ciphertext[i-block_size:i]
    while( i > 0 ):
        i-=block_size
        block_result = cipher.decrypt( str(block) )
        block_result = bytearray(block_result)

        if i > 0:
            block = ciphertext[i-block_size:i]
        else:
            block = iv
        block_result = encrypt_otp_xor( block, block_result )
        plaintext = block_result + plaintext

    plaintext = trim_pkcs7_padding( plaintext )

    return plaintext

def encrypt_aes128_ecb( plaintext, key ):
    cipher = AES.new( key )
    plaintext = apply_pkcs7_padding( plaintext, 16 )
    ciphertext = cipher.encrypt( str(plaintext) )
    return bytearray(ciphertext)

def decrypt_aes128_ecb( ciphertext, key ):
    cipher = AES.new( key)
    plaintext = cipher.decrypt( str(ciphertext) )
    plaintext = trim_pkcs7_padding( plaintext )
    return bytearray(plaintext)
