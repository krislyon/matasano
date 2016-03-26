def convert_array_to_hex( data ):
    return ''.join([format(v,'02x') for v in data])

def convert_hex_to_array( data ):
    return bytearray.fromhex( data.strip() )

def convert_array_to_ascii( data ):
    return ''.join(chr(i) for i in data )
