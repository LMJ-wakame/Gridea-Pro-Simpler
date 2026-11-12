package domain

import "testing"

func TestValidateVersions(t *testing.T) {
	for _, versions := range [][]PostVersion{
		{{Language: "../en"}}, {{Language: "en/../../x"}}, {{Language: ""}},
		{{Language: "zh-Hant"}, {Language: "zh-hant"}},
	} {
		if ValidatePostVersions(versions) == nil {
			t.Fatalf("accepted invalid versions: %#v", versions)
		}
	}
	if err := ValidatePostVersions([]PostVersion{{Language: "en"}, {Language: "ja"}, {Language: "zh-Hant"}}); err != nil {
		t.Fatal(err)
	}
}
