import torch
import torch.nn as nn
from torchvision import models


# ============================================================
# FractureNet
# MobileNetV3 Large + AlexNet
# ============================================================

class FractureNet(nn.Module):

    def __init__(self, num_classes, freeze_backbones=False):
        super().__init__()

        # ----------------------------------------------------
        # MobileNetV3 Large
        # ----------------------------------------------------

        mobilenet = models.mobilenet_v3_large(
            weights=None
        )

        self.mobilenet = mobilenet.features

        self.mobile_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.mobile_dim = 960

        # ----------------------------------------------------
        # AlexNet
        # ----------------------------------------------------

        alexnet = models.alexnet(
            weights=None
        )

        self.alexnet = alexnet.features

        self.alex_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.alex_dim = 256

        # ----------------------------------------------------
        # Freeze Backbones
        # ----------------------------------------------------

        if freeze_backbones:

            for p in self.mobilenet.parameters():
                p.requires_grad = False

            for p in self.mobilenet[-1].parameters():
                p.requires_grad = True

            for p in self.alexnet.parameters():
                p.requires_grad = False

            for p in self.alexnet[-1].parameters():
                p.requires_grad = True

        # ----------------------------------------------------
        # MobileNet Head
        # ----------------------------------------------------

        self.mobile_head = nn.Sequential(

            nn.Linear(960, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # AlexNet Head
        # ----------------------------------------------------

        self.alex_head = nn.Sequential(

            nn.Linear(256, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # Classifier
        # ----------------------------------------------------

        fused_dim = 512

        self.classifier = nn.Sequential(

            nn.Linear(fused_dim, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True),

            nn.Dropout(0.5),

            nn.Linear(256, 128),

            nn.BatchNorm1d(128),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(128, num_classes)
        )

    def forward_features(self, x):

        mobile_feat = self.mobilenet(x)

        mobile_feat = self.mobile_pool(mobile_feat)

        mobile_feat = torch.flatten(
            mobile_feat,
            1
        )

        mobile_feat = self.mobile_head(
            mobile_feat
        )

        alex_feat = self.alexnet(x)

        alex_feat = self.alex_pool(alex_feat)

        alex_feat = torch.flatten(
            alex_feat,
            1
        )

        alex_feat = self.alex_head(
            alex_feat
        )

        fused = torch.cat(
            (
                mobile_feat,
                alex_feat
            ),
            dim=1
        )

        return fused

    def forward(self, x):

        features = self.forward_features(x)

        return self.classifier(features)


# ============================================================
# TumorNet
# ResNet152 + AlexNet
# ============================================================

class TumorNet(nn.Module):

    def __init__(self, num_classes, freeze_backbones=False):
        super().__init__()

        # ----------------------------------------------------
        # ResNet152
        # ----------------------------------------------------

        resnet = models.resnet152(
            weights=None
        )

        self.resnet = nn.Sequential(
            *list(resnet.children())[:-2]
        )

        self.resnet_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.resnet_dim = 2048

        # ----------------------------------------------------
        # AlexNet
        # ----------------------------------------------------

        alexnet = models.alexnet(
            weights=None
        )

        self.alexnet = alexnet.features

        self.alex_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.alex_dim = 256

        # ----------------------------------------------------
        # Freeze Backbones
        # ----------------------------------------------------

        if freeze_backbones:

            for p in self.resnet.parameters():
                p.requires_grad = False

            for p in self.resnet[-1].parameters():
                p.requires_grad = True

            for p in self.alexnet.parameters():
                p.requires_grad = False

            for p in self.alexnet[-1].parameters():
                p.requires_grad = True

        # ----------------------------------------------------
        # ResNet Head
        # ----------------------------------------------------

        self.resnet_head = nn.Sequential(

            nn.Linear(2048, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # AlexNet Head
        # ----------------------------------------------------

        self.alex_head = nn.Sequential(

            nn.Linear(256, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # Classifier
        # ----------------------------------------------------

        fused_dim = 512

        self.classifier = nn.Sequential(

            nn.Linear(fused_dim, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True),

            nn.Dropout(0.5),

            nn.Linear(256, 128),

            nn.BatchNorm1d(128),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(128, num_classes)
        )

    def forward_features(self, x):

        resnet_feat = self.resnet(x)

        resnet_feat = self.resnet_pool(
            resnet_feat
        )

        resnet_feat = torch.flatten(
            resnet_feat,
            1
        )

        resnet_feat = self.resnet_head(
            resnet_feat
        )

        alex_feat = self.alexnet(x)

        alex_feat = self.alex_pool(
            alex_feat
        )

        alex_feat = torch.flatten(
            alex_feat,
            1
        )

        alex_feat = self.alex_head(
            alex_feat
        )

        fused = torch.cat(
            (
                resnet_feat,
                alex_feat
            ),
            dim=1
        )

        return fused

    def forward(self, x):

        features = self.forward_features(x)

        return self.classifier(features)


# ============================================================
# LungCancerNet
# ResNet152 + AlexNet
# ============================================================

class LungCancerNet(nn.Module):

    def __init__(self, num_classes, freeze_backbones=False):
        super().__init__()

        # ----------------------------------------------------
        # ResNet152
        # ----------------------------------------------------

        resnet = models.resnet152(
            weights=None
        )

        self.resnet = nn.Sequential(
            *list(resnet.children())[:-2]
        )

        self.resnet_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.resnet_dim = 2048

        # ----------------------------------------------------
        # AlexNet
        # ----------------------------------------------------

        alexnet = models.alexnet(
            weights=None
        )

        self.alexnet = alexnet.features

        self.alex_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.alex_dim = 256

        # ----------------------------------------------------
        # Freeze Backbones
        # ----------------------------------------------------

        if freeze_backbones:

            for p in self.resnet.parameters():
                p.requires_grad = False

            for p in self.resnet[-1].parameters():
                p.requires_grad = True

            for p in self.alexnet.parameters():
                p.requires_grad = False

            for p in self.alexnet[-1].parameters():
                p.requires_grad = True

        # ----------------------------------------------------
        # ResNet Head
        # ----------------------------------------------------

        self.resnet_head = nn.Sequential(

            nn.Linear(2048, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # AlexNet Head
        # ----------------------------------------------------

        self.alex_head = nn.Sequential(

            nn.Linear(256, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # Classifier
        # ----------------------------------------------------

        fused_dim = 512

        self.classifier = nn.Sequential(

            nn.Linear(fused_dim, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True),

            nn.Dropout(0.5),

            nn.Linear(256, 128),

            nn.BatchNorm1d(128),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(128, num_classes)
        )

    def forward_features(self, x):

        resnet_feat = self.resnet(x)

        resnet_feat = self.resnet_pool(
            resnet_feat
        )

        resnet_feat = torch.flatten(
            resnet_feat,
            1
        )

        resnet_feat = self.resnet_head(
            resnet_feat
        )

        alex_feat = self.alexnet(x)

        alex_feat = self.alex_pool(
            alex_feat
        )

        alex_feat = torch.flatten(
            alex_feat,
            1
        )

        alex_feat = self.alex_head(
            alex_feat
        )

        fused = torch.cat(
            (
                resnet_feat,
                alex_feat
            ),
            dim=1
        )

        return fused

    def forward(self, x):

        features = self.forward_features(x)

        return self.classifier(features)


# ============================================================
# TBNet
# DenseNet121 + AlexNet
# ============================================================

class TBNet(nn.Module):

    def __init__(self, num_classes, freeze_backbones=False):
        super().__init__()

        # ----------------------------------------------------
        # DenseNet121
        # ----------------------------------------------------

        model = models.densenet121(
            weights=None
        )

        self.densenet = model.features

        self.densenet_pool = nn.AdaptiveAvgPool2d(
            (1, 1)
        )

        self.densenet_dim = 1024

        # ----------------------------------------------------
        # AlexNet
        # ----------------------------------------------------

        alexnet = models.alexnet(
            weights=None
        )

        self.alexnet = alexnet.features

        self.alex_pool = nn.AdaptiveAvgPool2d(
            (1, 1)
        )

        self.alex_dim = 256

        # ----------------------------------------------------
        # Freeze Backbones
        # ----------------------------------------------------

        if freeze_backbones:

            for p in self.densenet.parameters():
                p.requires_grad = False

            for p in self.densenet.denseblock4.parameters():
                p.requires_grad = True

            for p in self.alexnet.parameters():
                p.requires_grad = False

            for p in self.alexnet[-1].parameters():
                p.requires_grad = True

        # ----------------------------------------------------
        # DenseNet Head
        # ----------------------------------------------------

        self.densenet_head = nn.Sequential(

            nn.Linear(1024, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # AlexNet Head
        # ----------------------------------------------------

        self.alex_head = nn.Sequential(

            nn.Linear(256, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True)
        )

        # ----------------------------------------------------
        # Classifier
        # ----------------------------------------------------

        fused_dim = 512

        self.classifier = nn.Sequential(

            nn.Linear(fused_dim, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(inplace=True),

            nn.Dropout(0.5),

            nn.Linear(256, 128),

            nn.BatchNorm1d(128),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(128, num_classes)
        )

    def forward_features(self, x):

        densenet_feat = self.densenet(x)

        densenet_feat = torch.relu(
            densenet_feat
        )

        densenet_feat = self.densenet_pool(
            densenet_feat
        )

        densenet_feat = torch.flatten(
            densenet_feat,
            1
        )

        densenet_feat = self.densenet_head(
            densenet_feat
        )

        alex_feat = self.alexnet(x)

        alex_feat = self.alex_pool(
            alex_feat
        )

        alex_feat = torch.flatten(
            alex_feat,
            1
        )

        alex_feat = self.alex_head(
            alex_feat
        )

        fused = torch.cat(
            (
                densenet_feat,
                alex_feat
            ),
            dim=1
        )

        return fused

    def forward(self, x):

        features = self.forward_features(x)

        return self.classifier(features)