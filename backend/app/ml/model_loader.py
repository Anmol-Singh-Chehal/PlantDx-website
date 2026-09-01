import os

import torch

from huggingface_hub import hf_hub_download
from dotenv import load_dotenv

from app.ml.architectures import (
    FractureNet,
    TumorNet,
    LungCancerNet,
    TBNet
)


load_dotenv()


HF_TOKEN = os.getenv("HF_TOKEN")
HF_REPO_ID = os.getenv("HF_REPO_ID")


DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ============================================================
# Hugging Face file downloader
# ============================================================

def download_model(filename: str):

    if not HF_TOKEN:
        raise RuntimeError(
            "HF_TOKEN is not set."
        )

    if not HF_REPO_ID:
        raise RuntimeError(
            "HF_REPO_ID is not set."
        )

    print(
        f"Downloading {filename} from "
        f"Hugging Face repository {HF_REPO_ID}..."
    )

    path = hf_hub_download(
        repo_id=HF_REPO_ID,
        filename=filename,
        token=HF_TOKEN
    )

    print(
        f"Downloaded {filename}"
    )

    return path


# ============================================================
# Robust state_dict loader
# ============================================================

def load_checkpoint(model, checkpoint_path):

    checkpoint = torch.load(
        checkpoint_path,
        map_location=DEVICE
    )

    # --------------------------------------------------------
    # Case 1:
    # torch.save(model.state_dict(), path)
    # --------------------------------------------------------

    if isinstance(checkpoint, dict):

        if "state_dict" in checkpoint:

            state_dict = checkpoint["state_dict"]

        elif "model_state_dict" in checkpoint:

            state_dict = checkpoint["model_state_dict"]

        else:

            state_dict = checkpoint

    else:

        raise RuntimeError(
            f"Unsupported checkpoint format: "
            f"{type(checkpoint)}"
        )

    # --------------------------------------------------------
    # Handle DataParallel checkpoints
    # --------------------------------------------------------

    cleaned_state_dict = {}

    for key, value in state_dict.items():

        if key.startswith("module."):
            key = key[len("module."):]

        cleaned_state_dict[key] = value

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    model.load_state_dict(
        cleaned_state_dict,
        strict=False
    )

    return model


# ============================================================
# FractureNet
# ============================================================

def load_fracture_model():

    checkpoint_path = download_model(
        "Proposed_FractureNet_best.pth"
    )

    model = FractureNet(
        num_classes=2,
        freeze_backbones=False
    )

    model = load_checkpoint(
        model,
        checkpoint_path
    )

    model.to(DEVICE)

    model.eval()

    return model


# ============================================================
# TumorNet
# ============================================================

def load_tumor_model():

    checkpoint_path = download_model(
        "Proposed_TumorNet_best.pth"
    )

    model = TumorNet(
        num_classes=4,
        freeze_backbones=False
    )

    model = load_checkpoint(
        model,
        checkpoint_path
    )

    model.to(DEVICE)

    model.eval()

    return model


# ============================================================
# Lung Cancer
# ============================================================

def load_lung_cancer_model():

    checkpoint_path = download_model(
        "Proposed_LungCancerNet_best.pth"
    )

    model = LungCancerNet(
        num_classes=4,
        freeze_backbones=False
    )

    model = load_checkpoint(
        model,
        checkpoint_path
    )

    model.to(DEVICE)

    model.eval()

    return model


# ============================================================
# TB
# ============================================================

def load_tb_model():

    checkpoint_path = download_model(
        "Proposed_TBNet_best.pth"
    )

    model = TBNet(
        num_classes=2,
        freeze_backbones=False
    )

    model = load_checkpoint(
        model,
        checkpoint_path
    )

    model.to(DEVICE)

    model.eval()

    return model


# ============================================================
# Load ALL models
# ============================================================

def load_all_models():

    print("=" * 60)
    print("Loading MedScan AI ML models")
    print("=" * 60)

    print(f"Device: {DEVICE}")

    models = {}

    print("\n[1/3] Loading FractureNet...")
    models["fracture"] = load_fracture_model()

    print("\n[2/3] Loading TumorNet...")
    models["tumor"] = load_tumor_model()

    # print("\n[3/4] Loading LungCancerNet...")
    # models["cancer"] = load_lung_cancer_model()

    print("\n[3/3] Loading TBNet...")
    models["tb"] = load_tb_model()

    print("\n" + "=" * 60)
    print("ALL MODELS LOADED SUCCESSFULLY")
    print("=" * 60)

    return models