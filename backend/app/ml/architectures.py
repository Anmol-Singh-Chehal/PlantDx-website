import torch
import torch.nn as nn
import timm


class AppleNet(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.edgenext = timm.create_model("edgenext_small", pretrained=True, num_classes=0, global_pool="avg")
        self.vit = timm.create_model("vit_small_patch16_224", pretrained=True, num_classes=0, global_pool="avg")
        fusion_dim = self.edgenext.num_features + self.vit.num_features
        self.classifier = nn.Sequential(
            nn.Linear(fusion_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        edgenext_features = self.edgenext(x)
        vit_features = self.vit(x)
        fused_features = torch.cat((edgenext_features, vit_features), dim=1)
        return self.classifier(fused_features)


class CherryNet(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.vit = timm.create_model("vit_small_patch16_224", pretrained=True, num_classes=0, global_pool="avg")
        self.coat = timm.create_model("coat_lite_small", pretrained=True, num_classes=0, global_pool="avg")
        fusion_dim = self.vit.num_features + self.coat.num_features
        self.classifier = nn.Sequential(
            nn.Linear(fusion_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        vit_features = self.vit(x)
        coat_features = self.coat(x)
        fused_features = torch.cat((vit_features, coat_features), dim=1)
        return self.classifier(fused_features)


class GrapeNet(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.edgenext = timm.create_model("edgenext_small", pretrained=True, num_classes=0, global_pool="avg")
        self.vit = timm.create_model("vit_small_patch16_224", pretrained=True, num_classes=0, global_pool="avg")
        fusion_dim = self.edgenext.num_features + self.vit.num_features
        self.classifier = nn.Sequential(
            nn.Linear(fusion_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        edgenext_features = self.edgenext(x)
        vit_features = self.vit(x)
        fused_features = torch.cat((edgenext_features, vit_features), dim=1)
        return self.classifier(fused_features)


class MangoNet(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.pvt = timm.create_model("pvt_v2_b0", pretrained=True, num_classes=0, global_pool="avg")
        self.vit = timm.create_model("vit_small_patch16_224", pretrained=True, num_classes=0, global_pool="avg")
        fusion_dim = self.pvt.num_features + self.vit.num_features
        self.classifier = nn.Sequential(
            nn.Linear(fusion_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        pvt_features = self.pvt(x)
        vit_features = self.vit(x)
        fused_features = torch.cat((pvt_features, vit_features), dim=1)
        return self.classifier(fused_features)