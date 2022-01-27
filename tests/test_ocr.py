import json
import pathlib

import pytest

from coupon_reminders.services.ocr import ocr


@pytest.fixture
def image_bytes():
    event_file = pathlib.Path('tests/fixtures/lambda_event.json')
    with event_file.open() as fp:
        return json.loads(json.load(fp)['body'])['image']


def test_ocr(image_bytes):
    print(image_bytes)
    text = ocr(image_bytes)
    assert len(text) > 0
