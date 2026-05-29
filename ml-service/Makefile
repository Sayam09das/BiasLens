PYTHON ?= python

.PHONY: run test lint train

run:
	$(PYTHON) -m uvicorn app.main:app --reload

test:
	$(PYTHON) -m pytest tests

lint:
	$(PYTHON) -m compileall app core tests training scripts monitoring

train:
	$(PYTHON) training/train_random_forest_model.py
