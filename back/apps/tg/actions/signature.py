import hashlib
import typing as tp

from apps.tg.domain.exceptions.crypto.hash_not_found_exception import HashNotFoundException
from apps.tg.domain.exceptions.crypto.signature_invalid import SignatureInvalidException

def validate_signature(data: tp.Dict, token: str) -> bool:
    try:
        hash = data.pop("hash")
    except KeyError:
        raise HashNotFoundException("data must contain hash field")
    
    keys = list(data.keys())
    sorted_keys = sorted(keys)
    values = [f"{key}={data[key]}" for key in sorted_keys]
    values.append(token)

    values_string = ":".join(values)
    evalued_hash = hashlib.sha256(values_string.encode("utf-8")).hexdigest()

    if hash != evalued_hash:
        raise SignatureInvalidException("Signature is invalid")
    
    return True
    
