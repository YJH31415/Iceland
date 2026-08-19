# Eyjafjallajökull 2010 Ash Transport Simulator

브라우저에서 실행하는 물리 기반 화산재 수송 시뮬레이션의 초기 골격입니다.

## 현재 구현
- MapLibre GL JS 기반 지도
- 화산재 parcel의 3D 위치(lat/lon/altitude) 상태
- 구면 지구상에서의 위도/경도 이동
- 격자형 대기장 인터페이스와 삼선형 보간 구조
- 바람에 의한 advection
- 중력 침강(기본 Stokes + Cunningham 보정)
- 간단한 난류 확산(random-walk)
- 입자 농도 격자
- 런던/파리/프랑크푸르트 농도 추출
- 농도 기반 교육용 항공 위험 경보
- 시뮬레이션 시작 후 분출 고도 slider 잠금
- source height를 실험적으로 변경하는 UI
- 실제 ERA5 데이터를 넣을 수 있는 adapter 자리

## 중요
이 버전은 "실제 2010년 자료를 넣기 전의 실행 가능한 physics prototype"이다.
`data/atmosphere/sample.json`은 개발용 샘플 대기장이다.
실제 역사 재현에는 ERA5 pressure-level 자료와 검증된 Eyjafjallajökull source term을 넣어야 한다.

## 실행
로컬 HTTP 서버가 필요합니다.

```bash
python -m http.server 8000
```

그 후 `http://localhost:8000/` 접속.

`file://`로 직접 열지 마세요.

## 실제 데이터 연결 위치
- `data/atmosphere/` : ERA5 전처리 결과
- `data/source/` : 화산 source term
- `src/weather/WeatherGrid.js` : 대기장 보간
- `src/physics/` : 물리 모델
